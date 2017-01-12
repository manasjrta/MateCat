/**
 * React Component for the editarea.

 */
// var React = require('react');
var ProjectsStore = require('../../stores/ProjectsStore');
var Project = require('./ProjectContainer').default;
var FilterProjects = require("../FilterProjects").default;


class ProjectsContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projects : [],
            more_projects: true
        };
        this.renderProjects = this.renderProjects.bind(this);
        this.hideSpinner = this.hideSpinner.bind(this);
    }


    renderProjects(projects) {
        this.setState({
            projects: projects,
            more_projects: true
        });
    }

    hideSpinner() {
        this.setState({
                more_projects: false
            });
    }

    componentDidMount() {
        ProjectsStore.addListener(ManageConstants.RENDER_PROJECTS, this.renderProjects);
        ProjectsStore.addListener(ManageConstants.NO_MORE_PROJECTS, this.hideSpinner);
        $('.tooltipped').tooltip({delay: 50});
    }

    componentWillUnmount() {
        ProjectsStore.removeListener(ManageConstants.RENDER_PROJECTS, this.renderProjects);
        ProjectsStore.removeListener(ManageConstants.NO_MORE_PROJECTS, this.hideSpinner);
    }

    componentDidUpdate() {
        var self = this;
        if (!this.state.more_projects) {
            setTimeout(function () {
                $(self.spinner).fadeOut();
            }, 3000);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.projects !== this.state.projects || nextState.more_projects !== this.state.more_projects)
    }

    render() {
        var items = this.state.projects.map((project, i) => (
            <Project
                key={project.get('id')}
                project={project}
                lastActivityFn={this.props.getLastActivity}
                changeStatusFn={this.props.changeStatus}
                changeJobPasswordFn={this.props.changeJobPasswordFn}
                downloadTranslationFn={this.props.downloadTranslationFn}/>
        ));
        if (!items.size) {
            items = <div className="no-results-found"><span>No Project Found</span></div>;
        }

        // var spinner = <div className="row" ref={(spinner) => this.spinner = spinner}>
        //     <div className="col m12 center-align">
        //         <span>No more projects</span>
        //     </div>
        // </div>;
        var spinner = '';
        if (this.state.more_projects && this.state.projects.size > 9) {
            spinner = <div className="row">
                        <div className="manage-spinner" style={{minHeigth: '90px'}}>
                            <div className="col m12 center-align">
                                <div className="preloader-wrapper big active">
                                    <div className="spinner-layer spinner-blue-only">
                                        <div className="circle-clipper left">
                                            <div className="circle"></div>
                                        </div>
                                        <div className="gap-patch">
                                            <div className="circle"></div>
                                        </div>
                                        <div className="circle-clipper right">
                                            <div className="circle"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col m12 center-align">
                            <span>Loading projects</span>
                        </div>
                    </div>;
        } else if (this.state.projects.size > 9) {
            spinner = <div className="row">
                <div className="manage-spinner" style={{minHeight: '90px'}}>
                    <div className="col m12 center-align">
                        <span ref={(spinner) => this.spinner = spinner}>No more projects</span>
                    </div>
                </div>
            </div>;
        }

        if (!items.size) {
            items = <div className="no-results-found"><span>No Project Found</span></div>;
            spinner = '';
        }

        return <div>
                    {/*<section className="add-project">*/}
                        {/*<a href="/" target="_blank" className="btn-floating btn-large waves-effect waves-light right create-new blue-matecat tooltipped" data-position="bottom" data-delay="50" data-tooltip="Add new project"/>*/}
                    {/*</section>*/}
                    <section className="project-list">
                        <div className="container">
                            <div className="row">
                                <div className="col m12" ref={(container) => this.container = container}>
                                    {items}
                                </div>
                            </div>
                        </div>
                        {spinner}
                    </section>
                </div>;
    }
}

ProjectsContainer.propTypes = {
    projects: React.PropTypes.array,
};

ProjectsContainer.defaultProps = {
    projects: [],
};

export default ProjectsContainer ;