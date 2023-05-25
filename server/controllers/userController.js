import User from '../models/User.js'
const userController = {};

/*****************************************************************************************************************/
userController.read = async (req, res) => 
{
  try
  {
    const user = await User.find();
    res.send(user);

    console.log(`${new Date()}: successfully sent user data to client`)
  }

  catch (err)
  {
    console.log(err);
    res.status(500).send("Internal server error");
  }
}

/*****************************************************************************************************************/
userController.create = async (userData) => 
{
  const user = new User(userData);
  user.save();
}

/*****************************************************************************************************************/
userController.update = async (userID, projectID, updateType) => 
{
  switch (updateType)
  {
    case 'activeProject':
      await User.updateOne({ id: userID }, { activeProject: projectID }); 
      console.log(`${new Date()}: successfully updated user's |${userID}| active project to |${projectID}|`)
      break;
      
  }
}

export default userController;