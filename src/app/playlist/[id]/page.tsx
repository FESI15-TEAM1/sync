import TrackList from '../_components/TrakList';

const data = {
  tracks: [
    {
      id: 10,
      videoId: 'oZpYEEcvu5I',
      title: 'Rainy Days',
      artist: 'Someone',
      thumbnail: '',
    },
    {
      id: 11,
      videoId: 'dQw4w9WgXcQ',
      title: 'Midnight Drive',
      artist: 'Luna Wave',
      thumbnail: '',
    },
    {
      id: 12,
      videoId: 'kXYiU_JCYtU',
      title: 'Coffee & Vinyl',
      artist: 'The Mellow Room',
      thumbnail: '',
    },
    {
      id: 13,
      videoId: 'hT_nvWreIhg',
      title: 'Slow Fade',
      artist: 'Nova Kim',
      thumbnail: '',
    },
    {
      id: 14,
      videoId: '2Vv-BfVoq4g',
      title: 'Window Seat',
      artist: 'Haze Collective',
      thumbnail: '',
    },
  ],
};

export default function PlaylistDeatilPage() {
  return (
    <div className="p-2">
      <TrackList trackList={data.tracks} />
    </div>
  );
}
