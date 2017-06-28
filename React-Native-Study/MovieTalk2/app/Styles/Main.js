import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eae7ff',
    flex: 1,
    // paddingTop: 63,
    // flexDirection: 'row',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'rgba(100, 53, 201, 0.1)',
    paddingBottom: 6,
    paddingTop: 6,
    flex: 1,
  },
  itemContent: {
    flex: 1,
    marginLeft: 13,
    marginTop: 6,
  },
  itemHeader: {
    fontSize: 18,
    fontFamily: 'Helvetica Neue',
    fontWeight: '300',
    color: '#6435c9',
    marginBottom: 6,
  },
  itemMeta: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 6,
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'Helvetica Neue',
    fontWeight: '200',
    color: 'rgba(0, 0, 0, 0.8)',
    lineHeight: 26,
  },
  redText: {
    color: '#db2828',
    fontSize: 15,
  },
  itemImage: {
    // backgroundColor: 'red',
    height: 120,
    width: 80,
    marginLeft: 10,
  },
  image: {
    width: 80,
    height: 120,
  }
});

export { styles as default };
