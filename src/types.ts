export interface LessonStep {
  order: number;
  slug: string;
  title: string;
  contentLabel: string;
  contentTitle?: string;
  contentBody: string;
  tinted?: boolean;
  helperText?: string;
  privateField?: {
    label: string;
    placeholder: string;
    footerNote?: string;
  };
  buttonLabel: string;
}
