import { BaseEthnicGroupMapDto } from './BaseEthnicGroupMapDto';

export class AddEthnicGroupMapDto extends BaseEthnicGroupMapDto {
  constructor(longitude: number, latitude: number) {
    super(longitude, latitude);
  }
}
