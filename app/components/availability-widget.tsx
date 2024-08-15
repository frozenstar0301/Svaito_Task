import React from "react";
import styles from "./availability-widget.module.css";

const AvailabilityWidget = ({
  date = "---",
  generalMessage = "Enter a date to check availability",
  eighteenHolesMessage = "Checking 18 holes availability...",
  errorMessage = "",
  isEmpty = false,
}) => {
  // Function to format the date to a human-readable format
  const formatDate = (isoDate: string) => {
    if (!isoDate || isoDate === "---") return "---";

    const [year, month, day] = isoDate.split("-");
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return `${monthNames[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
  };

  return (
    <div className={styles.availabilityWidget}>
      {isEmpty ? (
        <div className={styles.availabilityEmptyState}>
          <h2>Welcome to the Golf Course Availability Checker</h2>
          <p>Enter a date to check availability for golf courses.</p>
          <p>Example: "Is October 9th available?"</p>
          <p>Please use the format YYYY-MM-DD for best results.</p>
        </div>
      ) : errorMessage ? (
        <div className={styles.availabilityErrorState}>
          <h2>Error</h2>
          <p>{errorMessage}</p>
        </div>
      ) : (
        <div className={styles.availabilityWidgetData}>
          <h2>
            Availability on {formatDate(date)}
          </h2>
          <p className={styles.generalMessage}>{generalMessage}</p>
          <p className={styles.eighteenHolesMessage}>{eighteenHolesMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityWidget;
