import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const imageUrl = imagePath ?? "/images/default-resume.png";

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header flex items-center justify-between gap-4">
        <div className="flex-1 space-y-1 text-left">
          <h2 className="text-xl font-bold text-black wrap-break-word">
            {companyName}
          </h2>
          <p className="text-sm text-gray-500 mt-1 wrap-break-word">{jobTitle}</p>
        </div>
        <div className="shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      <div className="gradient-border animate-in fade-in duration-1000 mt-4">
        <div className="w-full h-full">
          <img
            src={imageUrl}
            alt={`${companyName ?? "Resume"} preview`}
            className="w-full h-87.5 max-sm:h-55 object-cover object-top rounded-2xl"
          />
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;