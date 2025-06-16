export type FeedbackSetupDataProps = {
  code: string;
  descs: string;
  rowID: string;
}

export const feedbackSetupHeaders = [
  {
    accessorKey: "code",
    header: "Feedback Code",
  }, 
  {
    accessorKey: "descs",
    header: "Description",
  },
  {
    accessorKey: "rowID",
    header: "Row ID",
  }
]