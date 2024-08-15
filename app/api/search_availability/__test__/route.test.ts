import { POST } from '../route';
import { NextRequest } from 'next/server';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ start: "2024-08-20T10:00:00Z", tags: ["18holes"] }]),
  })
) as jest.Mock;

describe('POST /api/search_availability', () => {
  const createNextRequest = (body: any) => {
    return {
      json: async () => body,
    } as NextRequest;
  };

  it('should return error if no date is provided', async () => {
    const req = createNextRequest({});
    const res = await POST(req);

    // const jsonResponse = await res.json();
    expect(await res.json()).toEqual({
      message: 'No date provided. Please provide a date.',
      isValid: false,
      errorType: 'missing',
    });
  });

  it('should return error for past date', async () => {
    const req = createNextRequest({ date: '2020-01-01' });
    const res = await POST(req);

    expect(await res.json()).toEqual({
      message: 'The date is in the past. Please select a future date.',
      isValid: false,
      errorType: 'past_date',
    });
  });

  it('should return error for invalid date format', async () => {
    const req = createNextRequest({ date: '2024-13-01' });
    const res = await POST(req);

    expect(await res.json()).toEqual({
      message: 'Invalid month format. Please provide a valid month (01-12).',
      isValid: false,
      errorType: 'invalid_date',
    });
  });

  it('should return valid response for a correct date', async () => {
    const req = createNextRequest({ date: '2024-08-20' });
    const res = await POST(req);

    expect(await res.json()).toEqual({
      message: 'Anytime is available except for 04:00 AM.',
      eighteenHolesMessage: '18 holes availability is limited to times outside of 04:00 AM.',
      isValid: true,
      errorType: '',
    });
  });

  it('should handle server errors gracefully', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('API failure'))
    );
  
    const req = createNextRequest({ date: '2024-08-20' });
    const res = await POST(req);
  
    expect(res.status).toBe(500);  // Corrected here: Accessing `status` as a property
    expect(await res.json()).toEqual({
      message: 'An error occurred. Please try again later.',
      isValid: false,
      errorType: 'server',
    });
  });
});
