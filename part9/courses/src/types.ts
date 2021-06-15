export interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

export interface BaseWithDescription extends CoursePartBase {
  description: string;
}

export interface CourseNormalPart extends BaseWithDescription {
  type: "normal";
}
export interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

export interface CourseSubmissionPart extends BaseWithDescription {
  type: "submission";
  exerciseSubmissionLink: string;
}

export interface CourseWithRequirements extends BaseWithDescription {
  type: "special";
  requirements: string[];
}

export type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseWithRequirements;