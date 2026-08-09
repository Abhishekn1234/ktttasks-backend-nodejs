import assetMasterServices from "../services/assetMasterServices.js";
import assetHistoryServices from "../services/assetHistoryServices.js";

const getAllAssets = async (req, res) => {
  try {
    const { search } = req.query;
    const assets = await assetMasterServices.getAllAssets(search);
    res.render("assetsMaster/assetMaster", { assets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAssetById=async(req,res)=>{
    const {id}=req.params;
    try{
        const asset=await assetMasterServices.getAssetById(id);
        if(asset){
            res.status(200).json(asset);
        }else{
            res.status(404).json({error:'Asset not found'});
        }
    }catch(err){
        res.status(500).json({error:err.message});
    }
}
const getAssetBasedOnStatus = async (req, res) => {
    const { status } = req.query;
    try {
        const filterStatus = status === undefined ? "Available" : status || undefined;
        const assets = await assetMasterServices.getAssetsByStatus(filterStatus);

        const branchCountMap = {};
        let totalValue = 0;

        assets.forEach((asset) => {
            const branch = asset.location?.trim() || "Unknown";
            branchCountMap[branch] = (branchCountMap[branch] || 0) + 1;
            totalValue += Number(asset.purchaseCost || 0);
            
        });

        const branchTotals = Object.entries(branchCountMap).map(([branch, count]) => ({
            branch,
            count,
        }));

        const totalValueFormatted = totalValue.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });

        res.render("stock/stockview", {
            assets,
            selectedStatus: status || "",
            branchTotals,
            totalValueFormatted,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const createAsset=async(req,res)=>{
    const assetData=req.body;
    try{
        const newAsset=await assetMasterServices.createAsset(assetData);
        res.status(201).json(newAsset);
    }catch(err){
        res.status(500).json({error:err.message});
    }  
}
const updateAsset=async(req,res)=>{
    const {id}=req.params;
    const assetData=req.body;
    try{
        const updatedAsset=await assetMasterServices.updateAsset(id,assetData);
        if(updatedAsset){
            res.status(200).json(updatedAsset);
        }else{
            res.status(404).json({error:'Asset not found'});
        }
    }catch(err){
        res.status(500).json({error:err.message});
    }   
}
const getAssetBasedonStatus=async(req,res)=>{
    const {status}=req.query;
    try{
        const assetstatus=await assetMasterServices.getAssetBasedonStatus(status);
        res.status(200).json(assetstatus);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}
const deleteAsset=async(req,res)=>{
    const {id}=req.params;
    try{
        const deletedAsset=await assetMasterServices.deleteAsset(id);
        if(deletedAsset){
            res.status(200).json({message:'Asset deleted successfully'});
        }else{
            res.status(404).json({error:'Asset not found'});
        }
    }catch(err){
        res.status(500).json({error:err.message});
    }
}
const showScrapAssetPage=async(req,res)=>{
    const {id}=req.params;
    try{
        const asset=await assetMasterServices.getAssetById(id);
        if(!asset){
            return res.status(404).send('Asset not found');
        }
        res.render('assetsScrap/assetScrap', { assetId: id, asset });
    }catch(err){
        res.status(500).json({error:err.message});
    }
}
const scrapAsset=async(req,res)=>{
    const {id}=req.params;
    const payload=req.body;
    try{
        const scrappedAsset=await assetMasterServices.scrapAsset(id,payload);
        if(!scrappedAsset){
            return res.status(404).json({error:'Asset not found'});
        }
        res.status(200).json(scrappedAsset);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}
const getScrappedAssets=async(req,res)=>{
    try{
        const scrappedAssets=await assetMasterServices.getScrappedAssets();

        let totalWrittenOff=0;
        scrappedAssets.forEach((asset)=>{
            totalWrittenOff += Number(asset.purchaseCost || 0);
        });

        const totalWrittenOffFormatted = totalWrittenOff.toLocaleString("en-US",{
            style:"currency",
            currency:"USD",
        });

        res.render('assetsScrap/assetScrapped', {
            scrappedAssets,
            totalWrittenOffFormatted,
        });
    }catch(err){
        res.status(500).json({error:err.message});
    }
}
const getAssetHistory=async(req,res)=>{
    const {id}=req.params;
    try{
        const result=await assetHistoryServices.getAssetHistory(id);
        if(!result){
            return res.status(404).send('Asset not found');
        }
        res.render('assetsHistory/assetHistory', {
            assetId: id,
            asset: result.asset,
            history: result.history,
        });
    }catch(err){
        res.status(500).json({error:err.message});
    }
}
export default{
    getAllAssets,
    getAssetById,
    getAssetBasedOnStatus,
    getAssetBasedonStatus,
    createAsset,
    updateAsset,
    deleteAsset,
    showScrapAssetPage,
    scrapAsset,
    getScrappedAssets,
    getAssetHistory
}
