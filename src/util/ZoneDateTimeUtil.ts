import {
  DateTimeFormatter,
  Instant,
  ZoneId,
  ZonedDateTime,
} from '@js-joda/core';
import { Logger } from '@nestjs/common';




export class ZoneDateTimeUtil {
  private readonly logger = new Logger('ZoneDateTimeUtil');
  private instant: Instant;

  constructor(epochMilli: number) {
    this.instant = Instant.ofEpochMilli(epochMilli);
  }

  toLocalString() {
    this.logger.log('toLocalString');
    return ZonedDateTime.ofInstant(this.instant, ZoneId.SYSTEM).format(
      DateTimeFormatter.ISO_OFFSET_DATE_TIME,
    );
  }

  getStartDay(): string {
    // const d = DateTimeFormatter.ofPattern('yyyy-MM-ddThh:mm:ss.Z');
    this.logger.log('getStartDay');
    const zoneDateTime = ZonedDateTime.ofInstant(this.instant, ZoneId.SYSTEM)
      .withHour(0)
      .withMinute(0)
      .withSecond(0);

    return zoneDateTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
  }

  getEndDay(): string {
    this.logger.log('getEndDate');
    const zoneDateTime = ZonedDateTime.ofInstant(this.instant, ZoneId.SYSTEM)
      .withHour(23)
      .withMinute(59)
      .withSecond(59);
    return zoneDateTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
  }
}
