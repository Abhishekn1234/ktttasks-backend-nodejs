import AssetHistory from "../models/assetHistoryModel.js";
import assetMasterModel from "../models/assetMasterModel.js";

const logEvent = async (assetId, eventType, eventDescription) => {
  try {
    const history = await AssetHistory.create({
      assetId,
      eventType,
      eventDescription: eventDescription || null,
      eventDate: new Date(),
    });
    return history;
  } catch (error) {
    throw new Error(`Error logging asset history: ${error.message}`);
  }
};

const getAssetHistory = async (assetId) => {
  try {
    const asset = await assetMasterModel.findByPk(assetId, {
      include: [
        {
          model: AssetHistory,
          as: "history",
          order: [["eventDate", "ASC"]],
        },
      ],
    });

    if (!asset) {
      return null;
    }

    const history = asset.history || [];

    // Include the purchase event as the starting point of the asset lifecycle.
    const purchaseEvent = {
      historyId: null,
      eventType: "Created",
      eventDescription: `Asset purchased${asset.vendor ? ` from ${asset.vendor}` : ""}${asset.purchaseDate ? ` on ${asset.purchaseDate}` : ""}`,
      eventDate: asset.purchaseDate
        ? new Date(`${asset.purchaseDate}T00:00:00`)
        : asset.createdAt || new Date(),
    };

    const combined = [purchaseEvent, ...history.map((h) => h.toJSON())];

    return {
      asset: asset.toJSON(),
      history: combined.sort(
        (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
      ),
    };
  } catch (error) {
    throw new Error(`Error retrieving asset history: ${error.message}`);
  }
};

export default {
  logEvent,
  getAssetHistory,
};

