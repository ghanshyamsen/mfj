const express = require("express");
const router = express.Router();

// Call the router files with the routes
const indexRoutes = require("./indexRoutes");
const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const configRoutes = require("./configRoutes");
const staticRoutes = require("./staticRoutes");
const userRoutes = require("./userRoutes");
const objectiveRoutes = require("./objectiveRoutes");
const skillRoutes = require("./skillsRoutes");
const skillAssessmentRoutes = require("./skillAssessmentRoutes");
const schoolsRoutes = require("./schoolsRoutes");
const academicRoutes = require("./academicRoutes");
const courseworkRoutes = require("./courseworkRoutes");
const activitiesRoutes = require("./activitiesRoutes");
const hobbiesRoutes = require("./hobbiesRoutes");
const fcatRoutes = require("./fcatRoutes");
const faqRoutes = require("./faqRoutes");
const tcatRoutes = require("./tcatRoutes");
const tutorialRoutes = require("./tutorialRoutes");
const jobRoutes = require("./jobRoutes");
const hcatRoutes = require("./hcatRoutes");
const acatRoutes = require("./acatRoutes");
const careerRoutes = require("./careerRoutes");
const starterJobRoutes = require("./starterJobRoutes");
const personalityTypeRoutes = require("./personalityTypeRoutes");
const personalityProfileRoutes = require("./personalityProfileRoutes");
const employeesAassessmentsRoutes = require("./employeesAassessmentsRoutes");
const employersAassessmentsRoutes = require("./employersAassessmentsRoutes");
const articleRoutes = require("./articleRoutes");
const packageRoutes = require("./packageRoutes");
const publicRoutes = require("./publicRoutes");
const txnRoutes = require("./txnRoutes");
const lmsRoutes = require("./lmsRoutes");
const messagetemplateRoutes = require("./messagetemplateRoute");
const badgeRoutes = require("./badgeRoutes");
const productRoutes = require("./productRoutes");
const rankRoutes = require("./rankRoutes");
const levelRoutes = require("./levelRoutes");
const planRoutes = require("./planRoutes");
const chunkRoutes = require("./chunkRoutes");

router.use("/index", indexRoutes);

// Use authentication routes as a nested route
router.use("/auth", authRoutes);

// Use profile routes as a nested route
router.use("/profile", profileRoutes);

// Use Configuration routes as a nested route
router.use("/config", configRoutes);

// Use Statics routes as a nested route
router.use("/static", staticRoutes);

// Use Users routes as a nested route
router.use("/user", userRoutes);

// Use Objective routes as a nested route
router.use("/objective", objectiveRoutes);

// Use Skills routes as a nested route
router.use("/skills", skillRoutes);

// Use Skills Assessment routes as a nested route
router.use("/skills-assessment", skillAssessmentRoutes);

// Use Schools/Academic/Coursework routes as a nested route
router.use("/schools", schoolsRoutes);
router.use("/academic", academicRoutes);
router.use("/coursework", courseworkRoutes);

// Use Extracurricular Activitie routes as a nested route
router.use("/activitie-category", acatRoutes);
router.use("/activitie", activitiesRoutes);

// Use Hobbies And Interest routes as a nested route
router.use("/hobbies-category", hcatRoutes);
router.use("/hobbies", hobbiesRoutes);

// Use Faq Category/Faq routes as a nested route
router.use("/faq-category", fcatRoutes);
router.use("/faq", faqRoutes);

// Use Tutorial Category/Tutorial routes as a nested route
router.use("/tutorial-category", tcatRoutes);
router.use("/tutorial", tutorialRoutes);

// Use Jobs routes as a nested route
router.use("/job", jobRoutes);

// Use Career routes as a nested route
router.use("/career", careerRoutes);

// Use Career routes as a nested route
router.use("/starter-job", starterJobRoutes);

// Use Personality Profile routes as a nested route
router.use("/personality-profile", personalityProfileRoutes);

// Use Personality Type routes as a nested route
router.use("/personality-type", personalityTypeRoutes);

// Use Employers Assessments routes as a nested route
router.use("/employers-assessments", employersAassessmentsRoutes);

// Use Employees Assessments routes as a nested route
router.use("/employees-assessments", employeesAassessmentsRoutes);

// Use Articles routes as a nested route
router.use("/article", articleRoutes);

// Use Package routes as a nested route
router.use("/package", packageRoutes);

router.use("/", publicRoutes);

router.use("/transaction", txnRoutes);

router.use("/lms", lmsRoutes);

router.use("/message", messagetemplateRoutes);

router.use("/badge", badgeRoutes);

router.use("/product", productRoutes);

router.use("/rank", rankRoutes);

router.use("/level", levelRoutes);

router.use("/plan", planRoutes);

router.use('/media', (req, res, next) => {
    const referer = req.get('Referer') || '';
    const appSource = req.get('X-App-Source');
    const reqPath = req.path; // gives you the URL path after /media

    // console.log('Referer:', referer);
    // console.log('App Source:', appSource);
    // console.log('Requested Path:', reqPath);

    // ✅ Skip access check for /media/logo or any path starting with it
    if (reqPath.startsWith('/lms')) {

        const isFromMobileApp = appSource === 'mobile-app';
        const isFromAllowedReferer =
            referer.includes(process.env.REACTAPP_URL2) ||
            referer.includes(process.env.REACTAPP_URL) ||
            referer.includes(process.env.APP_URL) ||
            referer.includes('mail.google.com');

        if (!isFromMobileApp && !isFromAllowedReferer) {
            return res.status(403).send('Access Denied');
        }

        //return next();
    }


    next();
});

router.use("/chunk", chunkRoutes);

/*App Route */
const appAuthRoutes = require("./appAuthRoutes");
const appRoutes = require("./appRoutes");

// Use authentication routes as a nested route
router.use("/app", appAuthRoutes);
router.use("/app", appRoutes);

module.exports = router;
