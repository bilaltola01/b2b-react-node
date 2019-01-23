import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import { Ajax } from "../shared/ajax.utils";
import * as actionCreators from '../action-creators';
import { Toast } from "./Toast";
import { StorageManagerInstance } from "../shared/storage.utils";

class MenuCopyMeal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenu: null,
      selectedCategory: null,
      showRemoveConfirm: false,
      isOpen: false,
      loading: false,
      isSuccess: false
    };
    this.handleClickMenu = this.handleClickMenu.bind(this);
    this.handleClickCategory = this.handleClickCategory.bind(this);
    this.handleCopyClick = this.handleCopyClick.bind(this);
    this.handleConfirmCopy = this.handleConfirmCopy.bind(this);
    this.renderConfirm = this.renderConfirm.bind(this);
    this.renderToast = this.renderToast.bind(this);
  }
  handleClickMenu(x) {
    const { selectedMenu } = this.state;
    if (x && selectedMenu && selectedMenu.MenuID === x.MenuID) {
      this.setState({ selectedMenu: null });
    } else {
      this.setState({ selectedMenu: x });
    }
  }
  handleClickCategory(x) {
    const { selectedCategory } = this.state;
    if (
      x &&
      selectedCategory &&
      selectedCategory.MenunCategoryID === x.MenunCategoryID
    ) {
      this.setState({ selectedCategory: null });
    } else {
      this.setState({ selectedCategory: x });
    }
  }
  handleCopyClick() {
    this.setState({ isOpen: false, showRemoveConfirm: true });
  }
  async handleConfirmCopy() {
    this.setState({ loading: true });
    try {
      await Ajax().post("/menu-clone-meal", {
        body: JSON.stringify({
          meal: this.props.meal,
          menu: {
            MenuID: this.state.selectedMenu.MenuID || this.state.selectedMenu.id
          },
          category: {
            CategoryID: this.state.selectedCategory.Category.CategoryID,
            id: this.state.selectedCategory.MenuCategoryID || this.state.selectedCategory.id,
          }
        }),
        headers: {
          "content-type": "application/json",
          "cache-control": "no-cache",
          "x-access-token": StorageManagerInstance.read("token")
        }
      });
    } catch (e) {
      console.error("Error");
    }
    this.setState({
      loading: false,
      showRemoveConfirm: false,
      isSuccess: true
    });
    this.props.dispatch(actionCreators.getProfile());
  }
  renderConfirm() {
    const { loading } = this.state;
    return (
      this.state.selectedCategory && (
        <Modal ariaHideApp={false} isOpen={this.state.showRemoveConfirm}>
          <h2>Confirm Copy</h2>
          <p>
            Are you sure you want to copy meal "
            <strong>{this.props.meal.title}</strong>"
            <br />
            to menu "<strong>{this.state.selectedMenu.Title}</strong>"
            <br />
            and category "
            <strong>{this.state.selectedCategory.Category.Title}</strong>" ?
          </p>
          <footer className="group-buttons">
            <button
              disabled={loading}
              className="button--action"
              onClick={() => this.setState({ showRemoveConfirm: false })}
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={this.handleConfirmCopy}
              className="button--action"
            >
              {loading ? "Copying..." : "Yes"}
            </button>
          </footer>
        </Modal>
      )
    );
  }
  renderToast() {
    const { selectedCategory, selectedMenu } = this.state;
    const { meal } = this.props;
    return (
      <Toast onDismiss={e => this.setState({ isSuccess: false })}>
        <p>
          Meal {meal.Title || meal.title} has been copied to{" "}
          {selectedMenu.Title}
        </p>
      </Toast>
    );
  }
  render() {
    const { menus, meal } = this.props;
    const { selectedMenu, selectedCategory, isOpen, isSuccess } = this.state;
    return (
      <div className="menu--copy">
        <button onClick={() => this.setState({ isOpen: !isOpen })}>
          <img src="/assets/images/icon-copy.svg" />
        </button>
        {this.renderConfirm()}
        {meal &&
          selectedMenu &&
          selectedCategory &&
          isSuccess &&
          this.renderToast()}
        {isOpen && (
          <div className="menu--copy__menu">
            <header>
              Copy meal to
              <button onClick={() => this.setState({ isOpen: false })}>
                <img src="/assets/images/icon-close.svg" />
              </button>
            </header>
            {selectedMenu && (
              <h3 onClick={e => this.setState({ selectedMenu: null })}>
                &lt; {selectedMenu.Title}
              </h3>
            )}
            <ul>
              {!selectedMenu &&
                menus.map(x => {
                  return (
                    <li
                      onClick={e => this.handleClickMenu(x)}
                      className={
                        selectedMenu && selectedMenu.MenuID === x.MenuID
                          ? "menu--copy__selected"
                          : null
                      }
                      key={x.MenuID}
                    >
                      {x.Title}
                    </li>
                  );
                })}
              {selectedMenu &&
                selectedMenu.categories.map(x => {
                  return (
                    <li
                      onClick={e => this.handleClickCategory(x)}
                      className={
                        selectedCategory &&
                        selectedCategory.MenuCategoryID === x.MenuCategoryID
                          ? "menu--copy__selected"
                          : null
                      }
                      key={x.MenuCategoryID}
                    >
                      {x.Category.Title}
                    </li>
                  );
                })}
            </ul>
            <footer>
              <button
                onClick={e => this.handleCopyClick()}
                disabled={!selectedMenu}
                className="button--action"
              >
                Copy
              </button>
            </footer>
          </div>
        )}
      </div>
    );
  }
}

MenuCopyMeal.propTypes = {
  menus: PropTypes.array,
  meal: PropTypes.object
};

const mapStateToProps = state => {
  // console.log(state);
  return {
    menus:
      state._profile.profile && state._profile.profile.branches
        ? state._profile.profile.branches.reduce((arr, x) => {
            return [...arr, ...x.menus.map(m => m)];
          }, [])
        : []
  };
};

export default connect(mapStateToProps)(MenuCopyMeal);
