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

  it('중복된 해시태그는 한 번만 담는다', () => {
    expect(hashTagToArray('#감성 #감성 #락')).toEqual(['감성', '락']);
  });

  it('해시태그가 없으면 빈 배열을 반환한다', () => {
    expect(hashTagToArray('')).toEqual([]);
    expect(hashTagToArray('해시태그 없는 설명')).toEqual([]);
  });
});
