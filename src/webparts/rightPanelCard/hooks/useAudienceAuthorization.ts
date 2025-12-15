
import { useEffect, useState } from 'react';
import { MSGraphClient } from '@microsoft/sp-http';

export const useAudienceAuthorization = (
  audience: any[] | undefined,
  context: any
): boolean => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      const currentUserEmail = context.pageContext.user.email?.toLowerCase();

      if (!audience || audience.length === 0) {
        setIsAuthorized(true);
        return;
      }

      const userEmails = audience
        .filter(a => a.email)
        .map(a => a.email.toLowerCase());

      const groupIds = audience
        .filter(a => a.id?.startsWith('c:0t.c|tenant|'))
        .map(g => g.id.split('|').pop());

      const client: MSGraphClient = await context.msGraphClientFactory.getClient();
      let allGroupUsers: string[] = [];

      for (const groupId of groupIds) {
        try {
          const membersRes = await client.api(`/groups/${groupId}/members`).get();
          const membersEmails = membersRes.value
            .filter((m: any) => m.mail)
            .map((m: any) => m.mail.toLowerCase());
          allGroupUsers.push(...membersEmails);

          const ownersRes = await client.api(`/groups/${groupId}/owners`).get();
          const ownersEmails = ownersRes.value
            .filter((o: any) => o.mail)
            .map((o: any) => o.mail.toLowerCase());
          allGroupUsers.push(...ownersEmails);
        } catch (err) {
          console.error(`Error fetching group ${groupId}:`, err);
        }
      }

      const combinedAudience = [...userEmails, ...allGroupUsers];
      setIsAuthorized(combinedAudience.includes(currentUserEmail));
    };

    checkAuthorization();
  }, [audience, context]);

  return isAuthorized;
};