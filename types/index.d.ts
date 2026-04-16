interface Job {
  title: string;
  description: string;
  location: string;
  requiredSkills: string[];
}

interface FeedbackTip {
  type: "good" | "improve";
  tip: string;
  explanation?: string;
}

interface FeedbackCategory {
  score: number;
  tips: FeedbackTip[];
}

interface Feedback {
  overallScore: number;
  ATS: FeedbackCategory;
  toneAndStyle: FeedbackCategory;
  content: FeedbackCategory;
  structure: FeedbackCategory;
  skills: FeedbackCategory;
}

interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  imagePath: string;
  resumePath: string;
  feedback: Feedback;
}
