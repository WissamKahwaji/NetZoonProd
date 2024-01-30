import { Advertisement } from "../models/advertisements/advertisementsModel.js";

export const deleteFinishedAds = async (req, res) => {
  try {
    const currentDate = new Date();
    await Advertisement.deleteMany({
      advertisingEndDate: { $lte: currentDate.toISOString() },
    });
    console.log("Scheduled job: Finished ads deleted successfully.");
  } catch (error) {
    console.error("Scheduled job error:", error.message);
  }
};
