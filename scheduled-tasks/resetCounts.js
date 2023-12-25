import userModel from '../models/userModel.js';


export const resetCounts = async () => {
    try {
        const usersToUpdate = await userModel.find({
            subscriptionExpireDate: { $lte: new Date() },
        });

        for (const user of usersToUpdate) {

            const remainingFromLastMonth = user.realEstateListingsRemaining || 0;
            user.realEstateListingsRemaining = remainingFromLastMonth + 50;


            const remainingplanesFromLastMonth = user.planesListingsRemaining || 0;
            user.planesListingsRemaining = remainingplanesFromLastMonth + 50;

            const remainingcarsFromLastMonth = user.carsListingsRemaining || 0;
            user.carsListingsRemaining = remainingcarsFromLastMonth + 50;


            const newSubscriptionExpireDate = new Date();

            newSubscriptionExpireDate.setDate(newSubscriptionExpireDate.getDate() + 30);
            user.subscriptionExpireDate = newSubscriptionExpireDate;

            await user.save();
        }

        console.log('Counts reset for users with expired subscriptions.');
    } catch (error) {
        console.error('Error resetting counts:', error);
    }
}


