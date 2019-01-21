import {
  React,
  Helmet,
  Switch,
  Route,
  FormattedMessage,
  connect,
  compose,
  createStructuredSelector,
} from '@/commons';

import { injectReducer, injectSaga } from '@/utils';

import { makeSelectAuth } from '@/root/selectors';

import reducer from './reducer';

import saga from './saga';

import InstancesList from './list';

import InstancesView from './view';

const Home = ({ match, globalState }) => (
  <div>
    <FormattedMessage id="instances.title">
      {t => (
        <Helmet>
          <title>{t}</title>
          <meta
            name="description"
            content="A React.js Boilerplate application homepage"
          />
        </Helmet>
      )}
    </FormattedMessage>
    <div>
      <Switch>
        <Route path={`${match.path}/:customerId`} component={InstancesView} />
        <Route path={`${match.path}`} exact component={InstancesList} />
      </Switch>
    </div>
  </div>
);

Home.propTypes = {
  // auth: PropTypes.shape({
  //   user: PropTypes.shape({
  //     name: PropTypes.string,
  //     id: PropTypes.number,
  //   }),
  // }),
};

const withSaga = injectSaga({ key: 'instances', saga });
const withReducer = injectReducer({ key: 'instances', reducer });

export function mapDispatchToProps() {
  return {};
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  globalState: state => state,
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withReducer,
  withConnect,
  withSaga,
)(Home);
