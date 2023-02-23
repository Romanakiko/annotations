import {DocFile} from "../../../doc-info/doc-info";

export interface Annotation {
  id: string,
  position: {x: number, y: number},
  positionDocument?: {x: number, y: number},
  size?: {height: number, width: number},
  text?: string,
  color: string,
  image?: DocFile,
  downed?: boolean
}

export interface FileToAnnotations {
  fileId: string,
  annotationIds: string[]
}
