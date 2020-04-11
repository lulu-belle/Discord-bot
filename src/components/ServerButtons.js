import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchServers } from "../actions";

class ServerButtons extends React.Component {
  async componentDidMount() {
    await this.props.fetchServers();
    console.log(this.props.servers);
  }

  renderButtons() {
    if (this.props.servers) {
      return (
        <div>
          {this.props.servers.map(server => {
            return (
              <Link
                className={`link server-${server.guild_id}`}
                to={`/server/${server.guild_id}`}
              >
                {server.guild_id}
              </Link>
            );
          })}
        </div>
      );
    }
  }

  render() {
    return (
      <div className="header">
        <h2>Plus de serveurs</h2>
        <div className="server-buttons">{this.renderButtons()}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    servers: state.servers.servers
  };
};

export default connect(mapStateToProps, { fetchServers })(ServerButtons);
