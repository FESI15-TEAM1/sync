import { hashTagToArray } from './hashTag';

describe('hashTagToArray', () => {
  it('공백으로 구분된 해시태그를 추출한다', () => {
    expect(hashTagToArray('제이팝 같이 들어요 #제이팝 #감성')).toEqual([
      '제이팝',
      '감성',
    ]);
  });

  it('줄바꿈으로 구분된 해시태그도 추출한다', () => {
    expect(hashTagToArray('제이팝 같이 들어요\n#제이팝\t#감성')).toEqual([
      '제이팝',
      '감성',
    ]);
  });

  it('# 만 입력된 경우 빈 태그를 만들지 않는다', () => {
    expect(hashTagToArray('여기 # 태그  #감성')).toEqual(['감성']);
  });

  it('공백 없이 이어 붙인 해시태그를 각각 분리한다', () => {
    expect(hashTagToArray('#인디#감성#제이팝')).toEqual([
      '인디',
      '감성',
      '제이팝',
    ]);
    expect(hashTagToArray('설명 #인디#감성 #제이팝')).toEqual([
      '인디',
      '감성',
      '제이팝',
    ]);
  });

  it('공백으로 구분된 태그와 이어 붙인 태그가 섞여 있어도 모두 분리한다', () => {
    expect(hashTagToArray('#안녕 #하세요 #목마름#목아픔')).toEqual([
      '안녕',
      '하세요',
      '목마름',
      '목아픔',
    ]);
  });

  it('공백 없이 이어 붙인 중복 해시태그도 한 번만 담는다', () => {
    expect(hashTagToArray('#안녕#안녕#안녕')).toEqual(['안녕']);
  });

  it('다른 글자에 붙어 있는 해시태그도 추출한다', () => {
    expect(hashTagToArray('제이팝#인디 #감성')).toEqual(['인디', '감성']);
    expect(hashTagToArray('제이팝 같이 들어요#인디#감성')).toEqual([
      '인디',
      '감성',
    ]);
  });

  it('중복된 해시태그는 한 번만 담는다', () => {
    expect(hashTagToArray('#감성 #감성 #인디')).toEqual(['감성', '인디']);
  });

  it('해시태그가 없으면 빈 배열을 반환한다', () => {
    expect(hashTagToArray('')).toEqual([]);
    expect(hashTagToArray('해시태그 없는 설명')).toEqual([]);
  });

  it('2글자 미만인 태그는 버린다', () => {
    expect(hashTagToArray('#락 #힙합')).toEqual(['힙합']);
  });

  it('8글자를 넘는 태그는 자르지 않고 버린다', () => {
    expect(
      hashTagToArray('#여덟글자까지는허용 #여덟글자까지허용 #감성'),
    ).toEqual(['여덟글자까지허용', '감성']);
  });

  it('태그가 9개를 넘으면 앞에서부터 9개만 담는다', () => {
    const description = Array.from(
      { length: 12 },
      (_, index) => `#태그${index}`,
    ).join(' ');

    expect(hashTagToArray(description)).toEqual([
      '태그0',
      '태그1',
      '태그2',
      '태그3',
      '태그4',
      '태그5',
      '태그6',
      '태그7',
      '태그8',
    ]);
  });
});
