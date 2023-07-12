import React, { Component } from "react";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdChevronRight,
  MdKeyboardArrowDown,
  MdAddBox,
  MdIndeterminateCheckBox,
  MdFolder,
  MdFolderOpen,
  MdInsertDriveFile
} from "react-icons/md";

const nodes = [
  {
    value: "ParentOne",
    label: "ParentOne",
    showCheckbox: false,
    expandOnClick:true,
    children: [
      {
        value: 1,
        label: "All",
        isAll:true
      },
      {
        value: "SectionOneChild",
        label: "SectionOneChild",
        pid:1
      },
      {
        value: "SectionTwo",
        label: "SectionTwo",
        pid:1
      }
    ]
  },
  {
    value: "ParentTwo",
    label: "ParentTwo",
    showCheckbox: false,
    children: [
      {
        value: 2,
        label: "All",
        isAll:true
      },
      {
        value: "ParentTwo-Child-1",
        label: "ParentTwo-Child-1",
        pid:2
      },
      {
        value: "ParentTwo-Child-2",
        label: "ParentTwo-Child-2",
        pid:2
      }
    ]
  }
];

class WidgetTree extends Component {
  state = {
    checked: [],
    expanded: [],
    category_id: [1,2,3,4,5,6],
    temp2:[]
  };

  render() {
    const { checked,temp2 } = this.state
    console.log('#checked',this.state.checked)
    // const icons = {
    //   check: <MdCheckBox className="rct-icon rct-icon-check" />,
    //   uncheck: <MdCheckBoxOutlineBlank className="rct-icon rct-icon-uncheck" />,
    //   halfCheck: (
    //     <MdIndeterminateCheckBox className="rct-icon rct-icon-half-check" />
    //   ),
    //   expandClose: (
    //     <MdChevronRight className="rct-icon rct-icon-expand-close" />
    //   ),
    //   expandOpen: (
    //     <MdKeyboardArrowDown className="rct-icon rct-icon-expand-open" />
    //   ),
    //   expandAll: <MdAddBox className="rct-icon rct-icon-expand-all" />,
    //   collapseAll: (
    //     <MdIndeterminateCheckBox className="rct-icon rct-icon-collapse-all" />
    //   ),
    //   parentClose: <MdFolder className="rct-icon rct-icon-parent-close" />,
    //   parentOpen: <MdFolderOpen className="rct-icon rct-icon-parent-open" />,
    //   leaf: <MdInsertDriveFile className="rct-icon rct-icon-leaf-close" />
    // };
    // console.log(nodes,'state');
    return (
      <CheckboxTree
        nodes={nodes}
        checked={this.state.checked}
        expanded={this.state.expanded}
        onCheck={(checked_el, a) => {
          console.log(checked, '$checked', a)
          if(this.state.category_id.includes(a.value)){
            if(a.checked){
              a.parent.children.map(el => {
                temp2.push(el.value)
              })
            }else {
              a.parent.children.map(el => {
                const index = temp2.indexOf(el.value);
                if (index > -1) {
                temp2.splice(index, 1);
                }
              })
            }
          }else if(a.checked){
            temp2.push(a.value)
          }else if(!a.checked){
            const index = temp2.indexOf(a.value);
            if (index > -1) {
              temp2.splice(index, 1);
            }
          }
          this.setState({ checked: temp2})
        }}
        onExpand={expanded => this.setState({ expanded })}
        // icons={icons}
      />
    );
  }
}
export default WidgetTree;
