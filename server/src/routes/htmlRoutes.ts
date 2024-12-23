import fs from 'fs/promises';
import { Router, type Request, type Response } from 'express';

const router = Router();

router.get('*', (_req: Request, res: Response) => {
    res.sendFile( '../../../client/index.html');
  
});

const searchHistoryFilePath = ('../../data/searchHistory.json');

// GET /api/weather/history
router.get('/history', async (_req, res) => {
  try {
    // Read the search history JSON file
    const fileContent = await fs.readFile(searchHistoryFilePath, 'utf-8');
    
    // Parse the JSON data
    const searchHistory = JSON.parse(fileContent);

    // Send the data as JSON response
    res.json(searchHistory);
  } catch (error) {
    console.error('Error reading search history:', error);

    // Handle errors (e.g., file not found or JSON parsing errors)
    res.status(500).json({ error: 'Unable to retrieve search history.' });
  }
});





export default router;
