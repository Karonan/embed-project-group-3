var Data = {pumpMode:-1,waterHeight:0,pumpStatus:-1,waterThreshold:0};


export const updateHeight = async (req, res) => {
  Data.waterHeight = req.body.height
  res.status(200).json({ message: "OK" });
};

export const togglePump = async (req, res) => {
  Data.pumpStatus = Data.pumpStatus*(-1);
  res.status(200).json({ message: "OK" });
};


export const setMode = async (req, res) => {
  Data.pumpMode = Data.pumpMode*(-1);
  res.status(200).json({ message: "OK" });
};

export const getStatus = async (req, res) => {
  res.status(200).json(Data);
};

export const setWaterThreshold = async (req, res) => {
  Data.waterThreshold = req.body.level
  res.status(200).json({ message: "OK" });
};


/*
res.status(200).json(items);
*/