"use client";

import React, { useState, useEffect } from "react";
import styles from "../shared/page.module.css";
import Chat from "../../components/chat";
import AvailabilityWidget from "../../components/availability-widget";

const SearchAvailability = () => {
  const [availabilityData, setAvailabilityData] = useState({
    message: "",
    eighteenHolesMessage: "",
    isValid: true,
    errorType: "",
    date: "---", // Default date value
  });

  const [isEmpty, setIsEmpty] = useState(true); // Initial state is empty

  const functionCallHandler = async (call: any) => {
    if (call?.function?.name !== "search_availability") return;

    const args = JSON.parse(call.function.arguments);
    const response = await fetch('/api/search_availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: args.date }),
    });

    const data = await response.json();
    setAvailabilityData({
      ...data,
      date: args.date || "---",
    });
    setIsEmpty(false); // Data is available after fetching

    return JSON.stringify(data);
  };

  // Update isEmpty state based on the availability data
  useEffect(() => {
    if (availabilityData.message || availabilityData.errorMessage) {
      setIsEmpty(false);
    }
  }, [availabilityData]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.column}>
          <AvailabilityWidget
            date={availabilityData.date}
            generalMessage={availabilityData.isValid ? availabilityData.message : ""}
            eighteenHolesMessage={availabilityData.isValid ? availabilityData.eighteenHolesMessage : ""}
            errorMessage={!availabilityData.isValid ? 
              (availabilityData.errorType === "missing" ? "No date provided. Please provide a date." :
              availabilityData.errorType === "invalid_date" ? "Invalid date format. Please ensure your date follows the format YYYY-MM-DD or a similar valid format." :
              availabilityData.errorType === "past_date" ? "The date is in the past. Please select a future date." :
              "An unexpected error occurred.") :
              ""
            }
            isEmpty={isEmpty}
          />
        </div>
        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <Chat functionCallHandler={functionCallHandler} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default SearchAvailability;
