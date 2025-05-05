const ReviewModel = require("../../models/reviews");
const EmpReviewModel = require("../../models/employerreviews");

class Review {

  /**
   * Candidates Review
   */
  async getcandidatereviews(req, res) {
    try {
      const { key } = req.params;
      const { job, employer, candidate, limit } = req.query;

      const query = ReviewModel.find().sort({ createdAt: -1 });

      if (key) {
        const result = await ReviewModel.findById(key);
        if (!result) {
          return res.status(404).json({ status: false, message: 'Review not found' });
        }
        return res.status(200).json({ status: true, data: result });
      }

      if (job) {
        query.where({ job_id: job });
      }

      if (employer) {
        query.where({ employer_id: employer });
      }

      if (candidate) {
        query.where({ candidate_id: candidate });
      }

      if (limit) {
        query.limit(parseInt(limit, 10));
      }

      const result = await query.exec();
      return res.status(200).json({ status: true, data: result });

    } catch (error) {
      return res.status(200).json({ status: false, message: error.message });
    }
  }

  async reviewtocandidate(req, res){
    try {

      const PostData = req.body;

      const isreviewed = await ReviewModel.findOne({from: PostData.employer_id, to: PostData.candidate_id});

      if(isreviewed){
        return res.status(200).json({ status: false, message: "You are already submitted review." });
      }

      const review = await ReviewModel.create(PostData);

      sendNotification({
        from: review.employer_id,
        to: review.candidate_id,
        message: `You have received review from the employer. ${review.review}`,
        key: 'candidate_review',
        extra: {}
      });

      return res.status(200).json({ status: true, message:"Review submitted successfully.", data: review });

    } catch (error) {
      return res.status(200).json({ status: false, message: error.message });
    }
  }

  async updatecandidatereview(req, res){
    try {

      const { key } = req.params;

      const PostData = req.body;

      const review = await ReviewModel.findOneAndUpdate(
        {_id:key},
        {$set:PostData},
        {new:true}
      );



      return res.status(200).json({ status: true, message:"Review updated successfully.", data: review });

    } catch (error) {
      return res.status(200).json({ status: false, message: error.message });
    }
  }

  async deletecandidatereview(req, res){
    try {

      const { key } = req.params;

      const review = await ReviewModel.findOneAndDelete({_id:key});

      return res.status(200).json({ status: true, message:"Review deleted successfully."});

    } catch (error) {
      return res.status(200).json({ status: false, message: error.message });
    }
  }


  /**
   * Employer Review
   */
  async getemployerreviews(req, res) {
    try {
      const { key } = req.params;
      const { job, employer, candidate, limit } = req.query;

      const query = EmpReviewModel.find().sort({ createdAt: -1 });

      if (key) {
        const result = await EmpReviewModel.findById(key);
        if (!result) {
          return res.status(404).json({ status: false, message: 'Review not found' });
        }
        return res.status(200).json({ status: true, data: result });
      }

      if (job) {
        query.where({ job_id: job });
      }

      if (employer) {
        query.where({ employer_id: employer });
      }

      if (candidate) {
        query.where({ candidate_id: candidate });
      }

      if (limit) {
        query.limit(parseInt(limit, 10));
      }

      const result = await query.exec();
      return res.status(200).json({ status: true, data: result });

    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  }

  async reviewtoemployer(req, res){
    try {

      const PostData = req.body;

      const isreviewed = await ReviewModel.findOne({from: PostData.candidate_id, to: PostData.employer_id});

      if(isreviewed){
        return res.status(200).json({ status: false, message: "You are already submitted review." });
      }


      const review = await EmpReviewModel.create(PostData);

      sendNotification({
        from: review.candidate_id,
        to: review.employer_id,
        message: `You have received a new review from the candidate. ${review.review}`,
        key: 'employer_review',
        extra: {}
      });

      return res.status(200).json({ status: true, message:"Review submitted successfully.", data: review });

    } catch (error) {
      return res.status(200).json({ status: false, message: error.message });
    }
  }

  async updateemployerreview(req, res){
    try {

      const { key } = req.params;

      const PostData = req.body;

      const review = await EmpReviewModel.findOneAndUpdate(
        {_id:key},
        {$set:PostData},
        {new:true}
      );

      return res.status(200).json({ status: true, message:"Review updated successfully.", data: review });

    } catch (error) {
      return res.status(200).json({ status: false, message: error.message });
    }
  }

  async deleteemployerreview(req, res){
    try {

      const { key } = req.params;

      const review = await EmpReviewModel.findOneAndDelete({_id:key});

      return res.status(200).json({ status: true, message:"Review deleted successfully."});

    } catch (error) {
      return res.status(200).json({ status: false, message: error.message });
    }
  }


}


module.exports = Review;
