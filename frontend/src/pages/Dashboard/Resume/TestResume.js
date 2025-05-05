import React, { useState, useRef, useEffect } from 'react';
import AboutMe from './Section/AboutMe';
import WorkExperience from './Section/WorkExperience';
import Education from './Section/Education';
import VolunteerExperience from './Section/VolunteerExperience';
import Skills from './Section/Skills';
import ExtracurricularActivities from './Section/ExtracurricularActivities';
import Contact from './Section/Contact';
import Hobbies from './Section/Hobbies';
import References from './Section/References';
import Certificates from './Section/Certificates';
import Awards from './Section/Awards';
import QrCode from './Section/QrCode';

const ContentSplitter = ({ resume, user }) => {
  const [maxHeight, setMaxHeight] = useState(1123);
  const [pageCount, setPageCount] = useState(0);
  const [showOriginal, setShowOriginal] = useState(true);
  const pagesContainerRef = useRef(null);
  const originalContentRef = useRef(null);

  useEffect(() => {
    resetContent();
  }, [resume]);

  const createPage = (pageNumber) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'cv-wrapper a4 mb-3';

    const inner = document.createElement('div');
    inner.className = 'cv-inner-style';

    const resumeContent = document.createElement('div');
    resumeContent.id = 'resumeContent';
    resumeContent.className = 'new-page-wrapper a4 mb-3 default_resume_content';
    resumeContent.style.pageBreakBefore = 'always';
    resumeContent.style.pageBreakAfter = 'always';

    const resumeBlock = document.createElement('div');
    resumeBlock.className = 'resume_page_block';

    const leftCol = document.createElement('div');
    leftCol.className = 'uic_default_content section';
    const rightCol = document.createElement('div');
    rightCol.className = 'uic_default_right_content section';

    resumeBlock.appendChild(leftCol);
    resumeBlock.appendChild(rightCol);
    resumeContent.appendChild(resumeBlock);
    inner.appendChild(resumeContent);
    wrapper.appendChild(inner);

    return { wrapper, leftCol, rightCol };
  };

  const deepSplitContent = () => {
    const container = originalContentRef.current;
    if (!container) return;

    pagesContainerRef.current.innerHTML = '';

    const leftColumn = container.querySelector('.uic_default_content');
    const rightColumn = container.querySelector('.uic_default_right_content');

    if (!leftColumn || !rightColumn) return;

    const leftChildren = Array.from(leftColumn.children);
    const rightChildren = Array.from(rightColumn.children);

    let pageNum = 1;
    let { wrapper: currentPage, leftCol: currentLeft, rightCol: currentRight } = createPage(pageNum);
    pagesContainerRef.current.appendChild(currentPage);
    let currentHeight = 0;

    const processContent = async (sideChildren, sideTarget) => {
      for (let child of sideChildren) {
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.width = '800px';
        document.body.appendChild(tempDiv);
        tempDiv.appendChild(child.cloneNode(true));
        const childHeight = tempDiv.offsetHeight;
        document.body.removeChild(tempDiv);

        if (currentHeight + childHeight > maxHeight) {
          // If even a small portion can fit, try to split the block
          if (child.tagName === 'DIV') {
            const splitResult = splitBlock(child, maxHeight - currentHeight);
            if (splitResult.fitted) {
              sideTarget.appendChild(splitResult.fitted);
              currentHeight += splitResult.fittedHeight;
            }

            // Move to new page
            pageNum++;
            ({ wrapper: currentPage, leftCol: currentLeft, rightCol: currentRight } = createPage(pageNum));
            pagesContainerRef.current.appendChild(currentPage);
            currentHeight = 0;

            if (splitResult.remaining) {
              await processContent([splitResult.remaining], sideTarget === currentLeft ? currentLeft : currentRight);
            }
          } else {
            // Move to new page if not a div
            pageNum++;
            ({ wrapper: currentPage, leftCol: currentLeft, rightCol: currentRight } = createPage(pageNum));
            pagesContainerRef.current.appendChild(currentPage);
            currentHeight = 0;
            sideTarget.appendChild(child.cloneNode(true));

            tempDiv.appendChild(child.cloneNode(true));
            currentHeight += tempDiv.offsetHeight;
          }
        } else {
          sideTarget.appendChild(child.cloneNode(true));
          currentHeight += childHeight;
        }
      }
    };

    const splitBlock = (block, availableHeight) => {
      const fitted = document.createElement('div');
      fitted.className = block.className;

      const remaining = document.createElement('div');
      remaining.className = block.className;

      let fittedHeight = 0;
      let childNodes = Array.from(block.childNodes);

      for (let node of childNodes) {
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.visibility = 'hidden';
        document.body.appendChild(tempDiv);
        tempDiv.appendChild(node.cloneNode(true));
        const nodeHeight = tempDiv.offsetHeight;
        document.body.removeChild(tempDiv);

        if (fittedHeight + nodeHeight <= availableHeight) {
          fitted.appendChild(node.cloneNode(true));
          fittedHeight += nodeHeight;
        } else {
          remaining.appendChild(node.cloneNode(true));
        }
      }

      return {
        fitted: fitted.childNodes.length ? fitted : null,
        fittedHeight,
        remaining: remaining.childNodes.length ? remaining : null,
      };
    };

    const maxBlocks = Math.max(leftChildren.length, rightChildren.length);
    const pairProcess = async () => {
      for (let i = 0; i < maxBlocks; i++) {
        const leftChild = leftChildren[i] || null;
        const rightChild = rightChildren[i] || null;

        if (leftChild) {
          await processContent([leftChild], currentLeft);
        }

        if (rightChild) {
          await processContent([rightChild], currentRight);
        }
      }
    };

    pairProcess().then(() => {
      setPageCount(pageNum);
      setShowOriginal(false);
    });
  };

  const resetContent = () => {
    if (pagesContainerRef.current) {
      pagesContainerRef.current.innerHTML = '';
    }
    setPageCount(0);
    setShowOriginal(true);
  };

  const Header = ({ data }) => (
    <div className='user_block'>
      {user && user.profile_image_visible && (
        <div className='user_img'>
          <img src={data.image || user} alt="User" />
        </div>
      )}
      <p className='mb-0 user_name'>{data.name}</p>
    </div>
  );

  return (
    <div className="content-splitter-container">
      <div className="controls mb-3">
        <h2>Resume Pagination</h2>
        <div className="d-flex align-items-center gap-3">
          <div>
            <label htmlFor="maxHeight" className="form-label">Page Height (px): </label>
            <input
              type="number"
              id="maxHeight"
              className="form-control"
              value={maxHeight}
              min="100"
              onChange={(e) => setMaxHeight(parseInt(e.target.value) || 1123)}
              style={{ width: '100px' }}
            />
          </div>
          <button className="btn btn-primary" onClick={deepSplitContent}>
            Paginate Resume
          </button>
          <button className="btn btn-secondary" onClick={resetContent}>
            Reset
          </button>
          {pageCount > 0 && <span className="ms-2">{pageCount} pages created</span>}
        </div>
      </div>

      <div className='common_background_block'>
        <div className={`cv-wrapper ${!showOriginal ? 'd-none' : ''}`}>
          <div className='cv-inner-style'>
            <div ref={originalContentRef} id='originalResumeContent'>
              {/* Your Original Resume */}
              <div className="new-page-wrapper a4 mb-3 default_resume_content">
                <div className={`resume_page_block`}>
                  <Header data={resume.user_info} />
                  <div className='user_info_content section'>
                    <div className='uic_default_content section'>
                      <Contact data={resume.user_info} position="left" />
                      <ExtracurricularActivities data={resume.extracurricular_activities} position="left" />
                      <Skills data={resume.skills} position="left" />
                      <Hobbies data={resume.hobbies} position="left" />
                    </div>
                    <div className='uic_default_right_content section'>
                      <AboutMe data={resume.objective_summary} position="right" />
                      <WorkExperience data={resume.work_experience} position="right" />
                      <Education data={resume.education} position="right" />
                      <VolunteerExperience data={resume.volunteer_experience} position="right" />
                      <Certificates data={resume.certification} position="right" />
                      <Awards data={resume.awards_achievments} position="right" />
                      <References data={resume.references} position="left" />
                      <QrCode user={user} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`cv-wrapper ${showOriginal ? 'd-none' : ''}`}>
          <div className='cv-inner-style'>
            <div ref={pagesContainerRef} className="pages-container"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSplitter;
