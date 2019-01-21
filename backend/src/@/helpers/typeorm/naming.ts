import { DefaultNamingStrategy } from "typeorm/naming-strategy/DefaultNamingStrategy";
import { NamingStrategyInterface } from "typeorm/naming-strategy/NamingStrategyInterface";
import { snakeCase } from "typeorm/util/StringUtils";

export class PluralNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {

    public tableName(targetName: string, userSpecifiedName: string): string {
        return userSpecifiedName ? userSpecifiedName : snakeCase(targetName);
    }

    public columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
        return snakeCase(embeddedPrefixes.concat(customName ? customName : propertyName).join("_"));
    }

    public columnNameCustomized(customName: string): string {
        return customName;
    }

    public relationName(propertyName: string): string {
        return snakeCase(propertyName);
    }

}
