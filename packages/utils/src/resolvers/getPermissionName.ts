import { permissionNames } from "../consts/permissionNames.js";

export function getPermissionName(permissionBits: bigint | bigint[]): string {
	const permissions = Object.keys(permissionNames).map(BigInt);
	const matchedPermissions: Set<string> = new Set();

	const inputArray = Array.isArray(permissionBits) ? permissionBits : [permissionBits];

	for (const permission of permissions) {
		for (const bits of inputArray) {
			if ((bits & permission) === permission) {
				matchedPermissions.add(`\`${permissionNames[permission.toString()]}\``);
			}
		}
	}

	return matchedPermissions.size > 0 ? Array.from(matchedPermissions).join(" ") : `${permissionBits}`;
}
