import { projectModel } from "../../../Database/models/project.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";

const addProject = catchAsyncError(async (req, res, next) => {
  try {
    console.log(req.body);

    const project = new projectModel(req.body);
    await project.save();

    res.status(201).json({ message: "success", project });
  } catch (error) {
    res.status(500).json(new AppError("Something went wrong!"));
  }
});
const getAllProjects = catchAsyncError(async (req, res, next) => {
  try {
    const projects = await projectModel.find();
    res.status(200).json({ message: "success", projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Error fetching projects" });
  }
});

const addMembers = catchAsyncError(async (req, res, next) => {
   const { email, adminId } = req.body;
   const { id } = req.params;

   try {
     const project = await projectModel.findById(id);
     if (!project) {
       return res.status(404).json({ message: "Project not found" });
     }

     if (project.members.includes(email)) {
       return res.status(400).json({ message: "Member already exists" });
     }

     project.members.push(email); 
     await project.save();

     res.status(200).json({ message: "Member added successfully", project });
   } catch (error) {
     console.error("Error adding member:", error);
     res.status(500).json({ message: "Error adding member" });
   }
});

export { addProject, getAllProjects, addMembers };
