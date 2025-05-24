// WorkStatus.ts

export const WorkStatus = {
    Submitted: 'Submitted',
    TestFlightPending: 'TestFlight Pending',
    TestFlightSent: 'TestFlight Sent',
    WaitingForUserFeedback: 'Waiting for User Feedback',
    InReviewByUser: 'In Review by User',
    ChangesInProgress: 'Changes in Progress',
    ReadyForFinalApproval: 'Ready for Final Approval',
    ApprovedForAppStore: 'Approved for App Store',
    SubmittedToAppStore: 'Submitted to App Store',
    AppStoreRejected: 'App Store Rejected',
    ReleasedByApple: 'Released by Apple',
    Cancelled: 'Cancelled'
} as const;

export type WorkStatusType = typeof WorkStatus[keyof typeof WorkStatus];
