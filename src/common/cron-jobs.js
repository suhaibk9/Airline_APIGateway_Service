const cron = require('node-cron');
const { BookingService } = require('../../services/index');
function scheduleCrons() {
  //Every 20mins
  cron.schedule('*/20 * * * *', async () => {
    const resp = await BookingService.cancelExpiredBookings();
    console.log('Expired bookings cancelled', resp);
  });
}
module.exports = scheduleCrons;

// For 1min -> * * * * *
// For 1sec -> * * * * * *
// for 20mins -> */20 * * * *
// for 20secs -> */20 * * * * *
// for 1hr -> 0 * * * *
// for 1day -> 0 0 * * *
// for 1week -> 0 0 * * 0
// for 1month -> 0 0 1 * *
// for 1year -> 0 0 1 1 *
