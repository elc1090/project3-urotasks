import User from '../models/User.js'
const userController = {};

/*****************************************************************************************************************/
userController.create = async (userData) => 
{
  const user = new User(userData);
  user.save();

  console.log(`${new Date()}: successfully created user ${user.name}`);
}

/*****************************************************************************************************************/
userController.updateActiveProject = async (userID, projectID) => 
{
  await User.updateOne({ id: userID }, { activeProject: projectID }); 
  console.log(`${new Date()}: successfully updated user's active project to |${projectID}|`);
}

export default userController;