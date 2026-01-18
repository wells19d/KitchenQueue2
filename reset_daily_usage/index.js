//* reset_daily_usage/index.js
const {initializeApp} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
const {onSchedule} = require('firebase-functions/v2/scheduler');
const {logger} = require('firebase-functions');

initializeApp();
const db = getFirestore();

exports.resetDailyUsage = onSchedule(
  {
    schedule: 'every day 00:00',
    region: 'us-central1',
    timeZone: 'America/Los_Angeles', // Pacific Time to match Firebase reset
  },
  async () => {
    try {
      const snapshot = await db.collection('accounts').get();
      const batch = db.batch();

      snapshot.forEach(doc => {
        const ref = doc.ref;
        batch.update(ref, {
          dailyRecipeCounter: 0,
          dailyUPCCounter: 0,
        });
      });

      await batch.commit();
      logger.info(`✅ Reset daily counters for ${snapshot.size} accounts`);
    } catch (error) {
      logger.error('❌ Failed to reset daily usage:', error);
    }
  },
);
