import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CourseDetail = () => {
  const { courseId } = useParams();
  return (
    <div className="page">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-4">Course Detail: {courseId}</h1>
        <p>Course details will be loaded here.</p>
        <button onClick={() => navigate('/courses')} className="btn btn-primary">Back to Courses</button>
      </div>
    </div>
  );
};

export default CourseDetail;
