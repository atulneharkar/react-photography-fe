import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as actions from '../../_actions';
import { required, history } from '../../_helpers';
import { renderInputField, renderSelectField, renderFileInputField } from '../../_components';
import loaderImg from '../../assets/images/loader.gif';

class TrendingForm extends Component {
  constructor(props) {
		super(props);

		this.state = {
			submitButtonText: 'Save',
			trendingId: '',
			trendingData: {
				title: '',
				videoLink: '',
				trendingCategory: ''
			}
		}
	}

	componentWillMount() {
		this.props.getTrendingCategory();

		const trendingId = this.props.match.params.trendingId;
    if(this.props.authenticated && !trendingId) {
      history.push('/');
    }

    if(trendingId) {
    	this.setState({ trendingId, submitButtonText: 'Update' });
    	this.props.getTrendingById(trendingId);
    }
  }

  componentWillReceiveProps(nextProps) {
  	if(nextProps.trendingData) {
    	this.setState({ trendingData: nextProps.trendingData });
    }
  }

	renderQueryResponse() {
		if(this.props.loading) {
			return <div className="loader">
				<div className="loader-overlay"></div>
				<img src={loaderImg} className="loader-img" alt="loader" />
			</div>;
		} else if(this.props.errorMessage) {
			return <div className="error-message">{this.props.errorMessage}</div>;
		}
	}

	handleInputChange(event, controlName = undefined) {
  	let target;
    let value;
    let key;

  	if(!controlName) {
  		target = event.target;
	    value = target.type === 'checkbox' ? target.checked : target.value;
	    key = target.name;
  	} else {
  		key = controlName;
  		value = event.value;
  	}

    const trendingData = this.state.trendingData;
    trendingData[key] = value;
    this.setState(trendingData);
  }

	handleFormSubmit(props) {
		if(this.state.trendingData.trendingCategory) {
			props['trendingCategory'] = this.state.trendingData.trendingCategory;
		}
    if(this.state.trendingId) {
      this.props.updateTrending(this.state.trendingId, props);
    } else {
      this.props.addTrending(props);
    }
  }

  render() {
		const { handleSubmit } = this.props;

		return (
		  <div className="trending-form">
				<form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
				  <p className="form-title">Trending Add / Update</p>
					<Field
		        name="title"
		        type="text"
		        component={renderInputField}
		        label="Title"
		        setValue={this.state.trendingData.title}
		        onValueChange={(e) => this.handleInputChange(e)}
		        validate={this.state.trendingData.title ? null : [required]}
		      />
		      <Field
		        name="videoLink"
		        type="text"
		        component={renderInputField}
		        label="Link"
		        setValue={this.state.trendingData.videoLink}
		        onValueChange={(e) => this.handleInputChange(e)}
		        validate={this.state.trendingData.videoLink ? null : [required]}
		      />
		      <Field
		        name="trendingCategory"
		        component={renderSelectField}
		        label="Category"
		        optionList={this.props.trendingCategory}
		        setValue={this.state.trendingData.trendingCategory}
		        onValueChange={(e) => this.handleInputChange(e, 'trendingCategory')}
		        // validate={[required]}
		      />
		      <Field
		        name="avatar"
	          component={renderFileInputField}
	          label="Trending Photo"
	        />
		      <div>
		        <button type="submit" className="submit-btn-link">{this.state.submitButtonText}</button>

		        <div className="admin-dashboard-link">
		          Back to <Link to="/admin/trendings">Admin Dashboard</Link>
		        </div>
		      </div>

		      {this.renderQueryResponse()}
				</form>
			</div>
		);
  }
}

const mapStateToProps = (state) => ({
	trendingData: state.trending.trendingDetail,
  errorMessage: state.trending.trendingError,
  loading: state.trending.trendingLoading,
  trendingCategory: state.trending.trendingCategory
});

TrendingForm = connect(
  mapStateToProps,
  actions
)(TrendingForm);

export default reduxForm({
  form: 'TrendingForm'
})(TrendingForm);
