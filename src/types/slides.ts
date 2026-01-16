export interface SlideContent {
  type: 'paragraph' | 'bullet';
  text: string;
  style?: {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline';
    color?: string;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    lineHeight?: number;
    letterSpacing?: number;
  };
}

export interface Slide {
  id: string;
  title: string;
  content: SlideContent[];
  backgroundColor?: string;
}

export interface SlideDeck {
  deckTitle: string;
  slides: Slide[];
}

export interface SlideUpdate {
  slideId: string;
  title?: string;
  content?: SlideContent[];
}