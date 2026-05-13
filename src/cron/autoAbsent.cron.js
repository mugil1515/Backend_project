const cron = require("node-cron");
const db = require("../config/db");

const startAutoAbsentCron = () => {

  // ======================================
  // RUN DAILY AT 11:59 PM
  // ======================================

  cron.schedule("59 23 * * *", async () => {

    try {

      console.log("AUTO ABSENT CRON STARTED");

      // ======================================
      // TODAY DATE
      // ======================================

      const today = new Date()
        .toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata"
        });

      // ======================================
      // FIND USERS WHO MISSED PUNCH OUT
      // ======================================

      const [rows] = await db.query(
        `
        SELECT id
        FROM attendance
        WHERE DATE(punch_in) = ?
        AND punch_out IS NULL
        `,
        [today]
      );

      // ======================================
      // MARK ABSENT
      // ======================================

      for (const item of rows) {

        await db.query(
          `
          UPDATE attendance
          SET
            attendance_status = 'ABSENT',
            working_hours = 0
          WHERE id = ?
          `,
          [item.id]
        );

        console.log(
          `Attendance ID ${item.id} marked ABSENT`
        );
      }

      console.log("AUTO ABSENT CRON COMPLETED");

    } catch (error) {

      console.error("CRON ERROR:", error);
    }

  });

};

module.exports = startAutoAbsentCron;