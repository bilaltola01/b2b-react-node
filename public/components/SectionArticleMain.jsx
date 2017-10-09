import React, { Component, PropTypes } from 'react';

import ChartPie from './ChartPie';
import Menu from './Menu';

class SectionArticleMain extends Component {
	render() {
		const { title, dateUpdate, component } = this.props;

		return (
			<article className="content--module module--failed-assets">
                <h2 className="content--subtitle">
                    {title}
                    {dateUpdate &&
                    	<span className="title--datetime">
	                        Updated
	                        <time dateTime="">
	                            <span className="title--date"> {dateUpdate.date}</span> <span className="title--timezone">{dateUpdate.timezone}</span>
	                        </time>
	                    </span>
                    }
                </h2>

                {component.type === "ChartPie" &&
	                <ChartPie id={component.id} title={component.title} ownProps={component.props} />
	            }

	            {component.type === "Menu" &&
	            	<div className="content--container">
	                	<Menu id={component.id} title={component.title} ownProps={component.props} />
	                </div>
	            }
            </article>
		)
	}
};

SectionArticleMain.propTypes = {
	title: PropTypes.string,
	dateUpdate: PropTypes.object,
    component: PropTypes.object
};

export default SectionArticleMain;