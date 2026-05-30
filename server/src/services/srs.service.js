class SRSService {

  static calculateNextReview(currentSRS, rating) {

    let stage = currentSRS.stage || 0;
    let interval = currentSRS.interval || 1;
    let status = "Reviewing";

    if (rating === "Again") {
      stage = 0;
      interval = 1;
      status = "Learning";
    }

    else if (rating === "Hard") {
      interval = Math.max(1, Math.ceil(interval * 1.2));
    }

    else if (rating === "Good") {

      if (stage === 0) interval = 3;
      else if (stage === 1) interval = 7;
      else if (stage === 2) interval = 21;
      else interval = Math.ceil(interval * 2.5);

      stage++;
    }

    else if (rating === "Easy") {

      if (stage === 0) interval = 5;
      else if (stage === 1) interval = 14;
      else if (stage === 2) interval = 30;
      else interval = Math.ceil(interval * 3);

      stage += 2;
    }

    if (interval > 30) {
      status = "Mastered";
    }

    const nextReviewDate = new Date();

    nextReviewDate.setDate(
      nextReviewDate.getDate() + interval
    );

    return {
      stage,
      interval,
      nextReviewDate,
      status
    };
  }
}

module.exports = SRSService;