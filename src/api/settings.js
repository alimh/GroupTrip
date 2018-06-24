import express from 'express';
import Settings from '../models/settings';

const router = new express.Router();

router.get('/all', (req, res) => {
  Settings.find({ removed_at: null }, (err, settings) => {
    if (err) {
      return res.status(403).end();
    }

    const settingsObj = settings.reduce((acc, s) => {
      const temp = {};
      const current = acc[s.settingsCategory] ? [...acc[s.settingsCategory]] : [];
      const item = {
        id: s.id,
        value: s.settingsValue,
      };
      current.push(item);
      temp[s.settingsCategory] = current;
      return { ...acc, ...temp };
    }, { Users: [], Categories: [] });

    return res.status(200).json(settingsObj).end();
  });
});

router.post('/new', (req, res) => {
  const newSetting = Settings({
    settingsCategory: req.body.category,
    settingsValue: req.body.value,
    created_at: new Date(),
    removed_at: null,
  });

  newSetting.save((err) => {
    if (err) throw err;
  });

  return res.status(200).end();
});

router.post('/remove', (req, res) => {
  Settings.findOneAndUpdate({
    _id: req.body.id,
  }, { removed_at: new Date() }, (err) => {
    if (err) throw err;
  });

  return res.status(200).end();
});

export default router;
