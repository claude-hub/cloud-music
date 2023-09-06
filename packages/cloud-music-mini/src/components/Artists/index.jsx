import PropTypes from 'prop-types';
import './index.less';

const Artists = (props) => {
  const { artists = [], onClickItem } = props;
  return (
    <div className='artists'>
      {artists.map(item => {
        const { name, picUrl } = item;
        return (
          <div key={name} className='center' onClick={() => onClickItem(name)}>
            <div><img loading="lazy" className='img' src={`${picUrl}?param=130y130`} alt="" /></div>
            {name}
          </div>
        )
      })}
    </div>
  )
}

Artists.propTypes = {
  artists: PropTypes.array.isRequired,
  onClickItem: PropTypes.func.isRequired
}

export default Artists;
