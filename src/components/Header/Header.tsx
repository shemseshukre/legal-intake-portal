import { useEffect, useRef, useState } from 'react';

type OpenMenu =
  | 'help'
  | 'notifications'
  | 'profile'
  | null;

function Header() {
  const [openMenu, setOpenMenu] =
    useState<OpenMenu>(null);

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      );
    };
  }, []);

  const toggleMenu = (menu: OpenMenu) => {
    setOpenMenu((current) =>
      current === menu ? null : menu,
    );
  };

  return (
    <header className="app-header" ref={headerRef}>
      <div className="header-left">
        <div
          className="logo-mark"
          aria-hidden="true"
        >
          ⚖
        </div>

        <div>
          <h1 className="header-title">
            Legal Intake Portal
          </h1>

          <p className="header-subtitle">
            Legal Request Management
          </p>
        </div>
      </div>

      <div className="header-actions">
        <div className="header-menu-wrapper">
          <button
            type="button"
            className="header-action"
            aria-label="Open help"
            aria-expanded={openMenu === 'help'}
            onClick={() => toggleMenu('help')}
          >
            ?
          </button>

          {openMenu === 'help' && (
            <div
              className="header-dropdown help-dropdown"
              role="dialog"
              aria-label="Help information"
            >
              <div className="dropdown-heading">
                <h2>Need Help?</h2>

                <button
                  type="button"
                  className="dropdown-close"
                  aria-label="Close help"
                  onClick={() =>
                    setOpenMenu(null)
                  }
                >
                  ×
                </button>
              </div>

              <p>
                Complete the legal request form and
                provide as much relevant information as
                possible.
              </p>

              <div className="help-item">
                <strong>Contract Review</strong>

                <span>
                  Use this option when you need a
                  contract or agreement reviewed.
                </span>
              </div>

              <div className="help-item">
                <strong>Required fields</strong>

                <span>
                  Fields marked with an asterisk (*) must
                  be completed before submission.
                </span>
              </div>

              <div className="help-item">
                <strong>Supporting documents</strong>

                <span>
                  PDF, DOC, and DOCX files up to 10 MB are
                  supported.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="header-menu-wrapper">
          <button
            type="button"
            className="header-action notification-button"
            aria-label="Open notifications"
            aria-expanded={
              openMenu === 'notifications'
            }
            onClick={() =>
              toggleMenu('notifications')
            }
          >
            🔔

            <span
              className="notification-badge"
              aria-label="3 unread notifications"
            >
              3
            </span>
          </button>

          {openMenu === 'notifications' && (
            <div
              className="header-dropdown notifications-dropdown"
              role="dialog"
              aria-label="Notifications"
            >
              <div className="dropdown-heading">
                <h2>Notifications</h2>

                <button
                  type="button"
                  className="dropdown-close"
                  aria-label="Close notifications"
                  onClick={() =>
                    setOpenMenu(null)
                  }
                >
                  ×
                </button>
              </div>

              <div className="notification-item">
                <span className="notification-dot" />

                <div>
                  <strong>
                    Legal team available
                  </strong>

                  <p>
                    The legal team is available to review
                    new requests.
                  </p>
                </div>
              </div>

              <div className="notification-item">
                <span className="notification-dot" />

                <div>
                  <strong>
                    Supporting documents
                  </strong>

                  <p>
                    Remember to attach relevant documents
                    to your request.
                  </p>
                </div>
              </div>

              <div className="notification-item">
                <span className="notification-dot" />

                <div>
                  <strong>
                    Request guidelines updated
                  </strong>

                  <p>
                    Review the latest legal request
                    guidelines before submitting.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="header-menu-wrapper">
          <button
            type="button"
            className="profile-button"
            aria-label="Open user profile menu"
            aria-expanded={openMenu === 'profile'}
            onClick={() => toggleMenu('profile')}
          >
            <span
              className="profile-avatar"
              aria-hidden="true"
            >
              JD
            </span>

            <span className="profile-info">
              <span className="profile-name">
                John Doe
              </span>

              <span className="profile-role">
                Requester
              </span>
            </span>

            <span
              className="profile-arrow"
              aria-hidden="true"
            >
              ▾
            </span>
          </button>

          {openMenu === 'profile' && (
            <div
              className="header-dropdown profile-dropdown"
              role="menu"
              aria-label="User profile menu"
            >
              <div className="profile-dropdown-header">
                <span
                  className="profile-avatar profile-avatar-large"
                  aria-hidden="true"
                >
                  JD
                </span>

                <div>
                  <strong>John Doe</strong>

                  <span>Requester</span>
                </div>
              </div>

              <div className="profile-menu-divider" />

              <button
                type="button"
                className="profile-menu-item"
                role="menuitem"
                onClick={() =>
                  alert('Profile page coming soon.')
                }
              >
                <span aria-hidden="true">👤</span>
                Profile
              </button>

              <button
                type="button"
                className="profile-menu-item"
                role="menuitem"
                onClick={() =>
                  alert('Settings page coming soon.')
                }
              >
                <span aria-hidden="true">⚙</span>
                Settings
              </button>

              <button
                type="button"
                className="profile-menu-item profile-menu-item-danger"
                role="menuitem"
                onClick={() =>
                  alert('Sign out functionality coming soon.')
                }
              >
                <span aria-hidden="true">↪</span>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;