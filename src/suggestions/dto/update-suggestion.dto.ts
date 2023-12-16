export class UpdateSuggestionDto {

    name?: string;
    description?: string;
    id_user?: string;
    id_category?: number;
    image1?: string;
    image2?: string;
    images_to_update?: Array<number>;
}