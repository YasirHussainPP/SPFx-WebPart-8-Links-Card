import * as React from 'react';
import styles from './RightPanelCard.module.scss';
import { IAcePanelCardProps, PanelAction } from './IRightPanelCardProps';
import { useEffect, useState } from 'react';
import { MSGraphClientV3 } from '@microsoft/sp-http';

// Fluent UI v8 for the right panel & buttons
import { Panel, PanelType, IIconProps,PrimaryButton } from '@fluentui/react';

// Default assets (fallback when props are empty)
const DEFAULT_ICON = '';
const DEFAULT_IMAGE = 'https://picsum.photos/seed/acepanel/800/480';

const AcePanelCard: React.FC<IAcePanelCardProps> = (props) => {
  const {
    cardSize, title, description, iconUrl, rightImageUrl,
    viewMoreLabel, panelActions,context,audience
  } = props;
   
 
const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
  const currentUserEmail = context.pageContext.user.email?.toLowerCase();
  console.log("Current User Email:", currentUserEmail);
  console.log("Audience Data:", audience);

  setIsAuthorized(false);

  if (!audience || audience.length === 0) {
    console.log("No audience restriction, showing card.");
    setIsAuthorized(true);
    return;
  }

  // Collect all user emails from audience
  const userEmails = audience
    .filter(a => a.email)
    .map(a => a.email.toLowerCase());

  console.log("Initial User Emails:", userEmails);

  //  Collect all group IDs
  const groupIds = audience
    .filter(a => a.id?.startsWith('c:0t.c|tenant|'))
    .map(g => g.id.split('|').pop());

  console.log("Group IDs:", groupIds);

  // Fetch members and owners for all groups
  context.msGraphClientFactory.getClient("3").then(async (client: MSGraphClientV3) => {
    let allGroupUsers: string[] = [];

    for (const groupId of groupIds) {
      try {
        // Fetch members
        const membersRes = await client.api(`/groups/${groupId}/members`).get();
        const membersEmails = membersRes.value
          .filter((m: any) => m.mail)
          .map((m: any) => m.mail.toLowerCase());

        console.log(`Members of group ${groupId}:`, membersEmails);
        allGroupUsers.push(...membersEmails);

        // Fetch owners
        const ownersRes = await client.api(`/groups/${groupId}/owners`).get();
        const ownersEmails = ownersRes.value
          .filter((o: any) => o.mail)
          .map((o: any) => o.mail.toLowerCase());

        console.log(`Owners of group ${groupId}:`, ownersEmails);
        allGroupUsers.push(...ownersEmails);
      } catch (err) {
        console.error(`Error fetching group ${groupId} members/owners:`, err);
      }
    }

    //  Combine all users (direct + group members/owners)
    const combinedAudience = [...userEmails, ...allGroupUsers];
    console.log("Combined Audience Emails:", combinedAudience);

    const isAuthorizedUser = combinedAudience.indexOf(currentUserEmail) !== -1;
    console.log("Is current user authorized?", isAuthorizedUser);

    setIsAuthorized(isAuthorizedUser);
  });
}, [audience]);



  if (!isAuthorized) {
    return < ></>;
  }


  const [isPanelOpen, setIsPanelOpen] = React.useState(false);
  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => setIsPanelOpen(false);

  const onActionClick = (a: PanelAction) => {
    if (!a?.url) return;
    if (a.openInNewTab ?? true) {
      window.open(a.url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = a.url;
    }
  };

  const TitleRow = (
    <div className={styles.titleRow}>
      <img src={iconUrl || DEFAULT_ICON} className={styles.icon} alt="" aria-hidden="true" />
      <span className={styles.title}>{title}</span>
    </div>
  );

  const DescriptionLarge = (
    <button
      type="button"
      className={styles.descriptionButton}
      onClick={openPanel}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPanel()}
      aria-label={`Open panel: ${ title}`}
    >
      {description}
    </button>
  );

  return (
    <>
      <article
        className={`${styles.card} ${cardSize === 'large' ? styles.large : styles.medium} ${props.isDarkTheme ? styles.dark : ''}`}
        // Medium: entire card opens the panel
        onClick={cardSize === 'medium' ? openPanel : undefined}
        role={cardSize === 'medium' ? 'button' : 'group'}
        tabIndex={cardSize === 'medium' ? 0 : -1}
        onKeyDown={(e) => (cardSize === 'medium' && (e.key === 'Enter' || e.key === ' ')) && openPanel()}
        aria-label={`${title || 'Card'} - ${cardSize === 'medium' ? 'opens panel' : ''}`}
      >
        {cardSize === 'large' ? (
          <div className={styles.largeRoot}>
            <div className={styles.left}>
              {TitleRow}
              {DescriptionLarge}

              {/* View more button (opens panel) */}
              <button
                type="button"
                className={styles.viewMore}
                onClick={(e) => { e.stopPropagation(); openPanel(); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); openPanel(); } }}
              >
                {viewMoreLabel || 'View more'}
              </button>
            </div>

            <div className={styles.right}>
              <img src={rightImageUrl || DEFAULT_IMAGE} className={styles.rightImage} alt="" aria-hidden="true" />
            </div>
          </div>
        ) : (
          <div className={styles.mediumRoot}>
            <div className={styles.topImageWrap}>
              <img src={rightImageUrl || DEFAULT_IMAGE} className={styles.topImage} alt="" aria-hidden="true" />
            </div>
            {TitleRow}
            <div className={styles.description}>{description}</div>
          </div>
        )}
      </article>

      {/* Right panel */}
      <Panel
        isOpen={isPanelOpen}
        onDismiss={closePanel}
        isLightDismiss
        headerText={title}
        closeButtonAriaLabel="Close"
        type={PanelType.medium} // medium width right panel
      >
        

        <div className={styles.actions}>
          {(panelActions || []).map((a, idx) => (
            <PrimaryButton
              key={`${a.label}-${idx}`}
              text={a.label}
              iconProps={a.iconName ? ({ iconName: a.iconName } as IIconProps) : undefined}
              onClick={() => onActionClick(a)}
              aria-label={a.label}
            />
          ))}
          {(!panelActions || panelActions.length === 0) && (
            <div className={styles.empty}>No actions configured.</div>
          )}
        </div>
      </Panel>
    </>
  );
};

export default AcePanelCard;