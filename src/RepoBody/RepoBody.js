import React from 'react';
import { Row, Col } from 'react-bootstrap';

const RepoBody = (props) => {
    const itemsExcerpt = props.items
    .slice(props.start, props.end);

    // Check for jobtitle and render if one exists
    function AdTitle(props) {
        const hasTitle = props.hasTitle;
        if (hasTitle) {
            return <div>Stilling: {hasTitle}</div>;
        };
        return null;
    };

    // Check for workplace and if multiple exists render with comma separated string 
    function AdWorkplaces(props) {
        const locations = props.city.workLocations;
        const locationArr = (locations.map((location) => (location.city))).join(', ');

        if (locations.length > 0) {
            return (
                <div className="workplace">Arbeidssted: {locationArr}</div>
            );
        };
        return null;
    };

    // Format date to dd/mm/yy
    function AdDateFormat(props) {
        if (props.date != null) {
            const formattedDate = new Intl.DateTimeFormat('en-GB', 
            {year: 'numeric', 
            month: 'numeric',
            ay: 'numeric', 
            hour12: false})
            .format(new Date(props.date.split('T')[0]));

            return formattedDate;
        };
        return null;
    };

    // populate ad item with json data
    return (    
        itemsExcerpt.map((item, index) => (      
            <Row className="ad-container" key={item.uuid}>
                <Col xs={12} className="ad-title">{item.title}</Col>
                <Col xs={12} className="ad-content-wrapper">
                    <Col xs={8} className="main-content">
                        <div className="employer">{item.employer.name}</div>
                        <div className="description" dangerouslySetInnerHTML={{ __html: item.description }}></div>
                    </Col>
                    <Col xs={4} className="sidebar">
                        <AdTitle hasTitle={item.jobtitle} />
                        <div>{item.engagementtype} - {item.extent}</div>
                        <div>Antall stillinger: {item.positioncount}</div>
                        <AdWorkplaces city={item} />
                        <div>Søknadsfrist: <AdDateFormat date={item.applicationDue} /></div>
                        <div>Publisert: <AdDateFormat date={item.published} /></div>
                    </Col>
                </Col>
                <Col xs={12} className="ad-link"><a href={item.link}>Se hele annonsen</a></Col>
            </Row>
        ))
    );
};

export default RepoBody;