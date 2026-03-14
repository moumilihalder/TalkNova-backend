import Chat from "../models/Chat.js";


// Save Chat
export const saveChat = async (req, res) => {

  const { message, response } = req.body;

  try {

    const chat = new Chat({
      user: req.userId,
      userMessage: message,
      aiReply: response
    });

    await chat.save();

    res.json(chat);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};



// Get All Chats (Sidebar History)
export const getChats = async (req, res) => {

  try {

    const chats = await Chat.find({
      user: req.userId
    }).sort({ createdAt: -1 });

    res.json(chats);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};



// Get Single Chat
export const getChatById = async (req, res) => {

  try {

    const chat = await Chat.findById(req.params.id);

    res.json(chat);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};



// Delete Chat
export const deleteChat = async (req, res) => {

  try {

    await Chat.findByIdAndDelete(req.params.id);

    res.json({ message: "Chat deleted successfully" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};