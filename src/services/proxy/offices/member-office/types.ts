export interface MemberOfficeProxyParamsInterface {
  id: number;
}
export interface MemberOfficeProxyTransformInterface {
  data:MemberOfficeDataInterface
}


export interface MemberOfficeProxyResponseInterface {
  data: MemberOfficeDataInterface
}

interface MemberOfficeDataInterface{
  office:MemberOfficeInterface,
  members:OfficeMembersInterface[],
}
interface MemberOfficeInterface {
  id: number;
  name: string;
  invitationCode: string;
  createdBy: {
    id: number;
    name: string;
    avatar?: string;
  };
  officeItems: any[];
  officeMembers: OfficeMembersInterface[];
  createdAt: string;
}

interface OfficeMembersInterface {
  id: number;
  officeId: number;
  member: {
    id: number;
    name: string;
    avatar?: string;
  };
  onlineStatus: string;
  transform: {
    position: {
      x: number;
      y: number;
      z: number;
    };
    rotation: {
      x: number;
      y: number;
      z: number;
    };
  };
}
