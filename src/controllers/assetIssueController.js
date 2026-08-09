import assetIssueServices from '../services/assetIssueServices.js';

const getAllIssues = async (req, res) => {
  try {
    const { search } = req.query;
    const issues = await assetIssueServices.getAllIssues(search);

    if (req.originalUrl.startsWith('/api/')) {
      return res.status(200).json(issues);
    }

    res.render('assetsIssues/assetIssue', { issues });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getIssueById = async (req, res) => {
  const { id } = req.params;
  try {
    const issue = await assetIssueServices.getIssueById(id);
    if (!issue) {
      if (req.originalUrl.startsWith('/api/')) {
        return res.status(404).json({ error: 'Issue record not found' });
      }
      return res.status(404).send('Issue record not found');
    }

    if (req.originalUrl.startsWith('/api/')) {
      return res.status(200).json(issue);
    }

    res.render('assetsIssues/assetIssueviewbyid', { issueId: id, issue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createIssue = async (req, res) => {
  const issueData = req.body;
 
  try {
    const newIssue = await assetIssueServices.createIssue(issueData);
    res.status(201).json(newIssue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const returnIssue = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    const updatedIssue = await assetIssueServices.returnIssue(id, payload);
    if (updatedIssue) {
      res.status(200).json(updatedIssue);
    } else {
      res.status(404).json({ error: 'Issue record not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteIssue = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedIssue = await assetIssueServices.deleteIssue(id);
    if (deletedIssue) {
      res.status(200).json({ message: 'Issue record deleted successfully' });
    } else {
      res.status(404).json({ error: 'Issue record not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const showCreateIssuePage = async (req, res) => {
  try {
    const { employees, assets } = await assetIssueServices.getIssueFormData();
    res.render('assetIssues/assetIssueadd', { employees, assets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const showReturnIssuePage = async (req, res) => {
  const { id } = req.params;
  try {
    const issue = await assetIssueServices.getIssueById(id);
    if (!issue) {
      return res.status(404).send('Issue record not found');
    }
    res.render('assetIssues/assetIssuereturn', { issueId: id, issue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllIssues,
  getIssueById,
  createIssue,
  returnIssue,
  deleteIssue,
  showCreateIssuePage,
  showReturnIssuePage,
};
