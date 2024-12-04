const cron = require('node-cron');
const Device = require('./models/Device');

// Turn off devices after 10 hours
cron.schedule('0 * * * *', async () => {
  const tenHoursAgo = new Date(Date.now() - 10 * 60 * 60 * 1000);

  const devicesToTurnOff = await Device.find({
    status: 'On',
    updatedAt: { $lte: tenHoursAgo },
  });

  devicesToTurnOff.forEach(async (device) => {
    device.status = 'Off';
    await device.save();
  });

  console.log('Devices turned off after 10 hours of use');
});

// Turn on the security system at 10:00 PM
cron.schedule('0 22 * * *', async () => {
  const securityDevices = await Device.find({ category: 'Security' });
  securityDevices.forEach(async (device) => {
    device.status = 'On';
    await device.save();
  });

  console.log('Security system turned on at 10:00 PM');
});
