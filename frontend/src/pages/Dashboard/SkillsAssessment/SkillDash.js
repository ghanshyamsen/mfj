import React from 'react';
import { useWizard } from "react-use-wizard";

function QuestionOne({data, GoNextStep }) {

    const { nextStep } = useWizard();

    const handleClickNext = () => {
        GoNextStep();
        nextStep();
    }

    return(
        <>
            <div className=''>
                <div className="rim_content">
                    <h1 className="rim_heading">Welcome to the Soft Skills Assessment Test!</h1>
                    <p className='desc'>  This short test is designed to help you discover your natural strengths in key soft skills. Soft skills are the abilities that help you communicate, work well with others, and adapt to new situations—skills that are important in your first job and beyond.</p>

                    <h3 className='ul_title'> How It Works  </h3>
                    <ul className=''>
                        <li>You’ll answer 15 questions based on everyday situations you might encounter in your life.</li>
                        <li>Each question has four options—just pick the one that best describes how you would respond.</li>
                        <li>There are no right or wrong answers. This test is all about understanding what comes naturally to you.</li>
                    </ul>

                    <h3 className='ul_title'> Why It Matters  </h3>
                    <p className='desc'> By the end of the test, you’ll learn about the top 5 soft skills you already have. Knowing these strengths can help you make the most of them in school, work, and social settings. </p>

                    <h3 className='ul_title'> Ready to find out what your natural strengths are? </h3>
                    <small className=''>Click Start to begin the test!</small>
                </div>
                

                <div className='btn_block'>
                    <button type="button" className='btn submit_btn mb-0' onClick={handleClickNext}> Start  </button>
                </div>
            </div>
        </>
    )
}

export default QuestionOne;